import { Owner } from "../../owner/entities/owner"

export const ownerConverter = {
    toFirestore(owner: Owner): FirebaseFirestore.DocumentData {
        return owner.asDTO()
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Owner {
        const data = snapshot.data()
        return Owner.createFromDTO(data)
    },
}
