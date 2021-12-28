import { initializeApp } from 'firebase/app'

import { getFirestore, collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

import firebaseConfig from '../../firebaseConfig'

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export const documentCreated = (callBack: (url: string, id: string) => void) => {
    
    let size: number | null = null

    function isError(song: QueryDocumentSnapshot) {
        const data = song.data()

        return !song.exists() && !data.url && !data.createdAt

    }

    onSnapshot(query(collection(firestore, 'songs'), orderBy('created_at')), (songs) => {

        if (!size) { songs.forEach((song) => { !isError(song) && callBack(song.data().id, song.id) }) } else if (songs.size > size) {

            const song = songs.docs[songs.size - 1]
            !isError(song) && callBack(song.data().id, song.id)

        }

        size = songs.size
    
    })

}

// ! everyone can delete data yikes! in firebase we need somehow to tell it that we're the admin of it
export const deleteDocument = (id: string) => deleteDoc(doc(firestore, 'songs', id))