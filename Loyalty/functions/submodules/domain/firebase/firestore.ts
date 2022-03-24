import { Config } from "../core/config"
import { DomainError } from "../core/error"
import * as admin from "firebase-admin"
import * as FirebaseFirestore from "@google-cloud/firestore"

const db = admin.firestore()

export class Transaction {
    firestoreTransaction: FirebaseFirestore.Transaction
    writeQueue: (() => void)[]

    constructor(firestoreTransaction: FirebaseFirestore.Transaction) {
        this.firestoreTransaction = firestoreTransaction
        this.writeQueue = []
    }

    create(
        docRef: FirebaseFirestore.DocumentReference,
        data: FirebaseFirestore.DocumentData,
        converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
    ): void {
        this.writeQueue.push(() => {
            this.firestoreTransaction.create(docRef, converter === undefined ? data : converter.toFirestore(data))
        })
    }

    update(
        docRef: FirebaseFirestore.DocumentReference,
        data: FirebaseFirestore.DocumentData,
        converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
    ): void {
        this.writeQueue.push(() => {
            this.firestoreTransaction.update(docRef, converter === undefined ? data : converter.toFirestore(data))
        })
    }

    delete(docRef: FirebaseFirestore.DocumentReference): void {
        this.writeQueue.push(() => {
            this.firestoreTransaction.delete(docRef)
        })
    }

    async getDoc(
        query: FirebaseFirestore.DocumentReference,
        converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
    ): Promise<FirebaseFirestore.DocumentSnapshot> {
        return await this.firestoreTransaction.get(converter === undefined ? query : query.withConverter(converter))
    }

    async getQuery(
        query: FirebaseFirestore.Query,
        converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
    ): Promise<FirebaseFirestore.QuerySnapshot> {
        return await this.firestoreTransaction.get(converter === undefined ? query : query.withConverter(converter))
    }

    applyAllWriteOperations(): void {
        this.writeQueue.forEach((operation) => operation())
    }
}

export async function runTransaction(
    updateFunction: (transaction: Transaction) => Promise<DTO | undefined> | undefined,
): Promise<ResponseResult> {
    try {
        return await db.runTransaction(async (firestoreTransaction) => {
            const transaction = new Transaction(firestoreTransaction)
            const results = await updateFunction(transaction)
            transaction.applyAllWriteOperations()
            return { data: results }
        })
    } catch (error) {
        console.log(`transaction finished with error: ${error}`)
        return { error: error }
    }
}

async function create(
    docRef: FirebaseFirestore.DocumentReference,
    data: FirebaseFirestore.DocumentData,
    transaction?: Transaction,
    converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
): Promise<void> {
    if (transaction) {
        transaction.create(docRef, data, converter)
    } else {
        converter ? await docRef.withConverter(converter).set(data) : await docRef.set(data)
    }
}

async function update(
    docRef: FirebaseFirestore.DocumentReference,
    data: FirebaseFirestore.DocumentData,
    transaction?: Transaction,
    converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
): Promise<void> {
    if (transaction) {
        transaction.update(docRef, data, converter)
    } else {
        converter ? await docRef.withConverter(converter).set(data) : await docRef.set(data)
    }
}

async function deleteDoc(docRef: FirebaseFirestore.DocumentReference, transaction?: Transaction): Promise<void> {
    if (transaction) {
        transaction.delete(docRef)
    } else {
        await docRef.delete()
    }
}

async function getDoc(
    docRef: FirebaseFirestore.DocumentReference,
    transaction?: Transaction,
    converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
): Promise<FirebaseFirestore.DocumentData | undefined> {
    if (transaction instanceof Transaction) {
        const transactionGetResult = await transaction.getDoc(docRef, converter)
        return transactionGetResult.data()
    } else {
        return converter ? (await docRef.withConverter(converter).get()).data() : (await docRef.get()).data()
    }
}

async function getCollection(
    query: FirebaseFirestore.Query,
    collectionRef: FirebaseFirestore.CollectionReference,
    transaction?: Transaction,
    converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
    pageSize?: number,
    nextPageToken?: string | null,
): Promise<{ docs: FirebaseFirestore.DocumentData[]; nextPageToken: string | null }> {
    if (nextPageToken) {
        const lastDocumentSnapshot = transaction ?
            await transaction.getDoc(collectionRef.doc(nextPageToken)) :
            await collectionRef.doc(nextPageToken).get()
        query = query.startAfter(lastDocumentSnapshot)
    }

    if (pageSize) query = query.limit(pageSize)

    let snapshot: FirebaseFirestore.QuerySnapshot | undefined
    if (transaction) {
        const transactionGetResult = await transaction.getQuery(query, converter)
        if (transactionGetResult instanceof FirebaseFirestore.QuerySnapshot) {
            snapshot = transactionGetResult
        }
    } else {
        snapshot = await getQuery(query, transaction, converter)
    }

    if (!snapshot) {
        throw new DomainError(Config.errorDomains.core, Config.errorCodes.corruptedData, "Corrupted data recieved")
    }

    if (snapshot.empty && pageSize && snapshot.size === pageSize) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id
    } else {
        nextPageToken = null
    }

    return { docs: snapshot.docs.map((doc) => doc.data()), nextPageToken: nextPageToken }
}

async function getQuery(
    query: FirebaseFirestore.Query,
    transaction?: Transaction,
    converter?: FirebaseFirestore.FirestoreDataConverter<FirebaseFirestore.DocumentData>,
): Promise<FirebaseFirestore.QuerySnapshot> {
    if (transaction) {
        const transactionGetResult = await transaction.getQuery(query, converter)
        if (transactionGetResult instanceof FirebaseFirestore.QuerySnapshot) return transactionGetResult
        throw new DomainError(Config.errorDomains.core, Config.errorCodes.corruptedData, "Corrupted data recieved")
    } else {
        return converter ? query.withConverter(converter).get() : query.get()
    }
}

export { db, create, update, deleteDoc, getDoc, getCollection }
