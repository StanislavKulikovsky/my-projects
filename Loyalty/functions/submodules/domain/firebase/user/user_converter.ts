import { User } from "../../user/entities/user"

export const userConverter = {
    toFirestore(user: User): FirebaseFirestore.DocumentData {
        return user.asDTO()
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
        const data = snapshot.data()
        return User.createFromDTO(data)
    },
}
