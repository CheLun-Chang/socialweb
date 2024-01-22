import { Item } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import firebase from "../utils/firebase";
import 'firebase/compat/firestore';
import Post from "../components/Post";
import { useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";



function Posts() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentTopic = urlSearchParams.get("topic");
    const [posts, setPosts] = useState([]);
    const lastPostSnapshotRef = useRef();
    useEffect(() => {
        if (currentTopic) {
            firebase
                .firestore()
                .collection("posts")
                .where('topic', '==', currentTopic)
                .orderBy('createdAt', 'desc')
                .limit(2)
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map((docSnapshot) => {
                        const id = docSnapshot.id;
                        return { ...docSnapshot.data(), id };
                    });
                    lastPostSnapshotRef.current =
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                    setPosts(data);
                });
        } else {
            firebase
                .firestore()
                .collection("posts")
                .orderBy('createdAt', 'desc')
                .limit(3)
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map((docSnapshot) => {
                        const id = docSnapshot.id;
                        return { ...docSnapshot.data(), id };
                    });
                    lastPostSnapshotRef.current =
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                    setPosts(data);
                });
        }
    }, [currentTopic]);
    return (
        <>
            <Item.Group>
                {posts.map((post) => {
                    return (
                        <Post post={post} key={post.id} />

                    );
                })}
            </Item.Group>
            <Waypoint onEnter={() => {
                if (lastPostSnapshotRef.current) {
                    if (currentTopic) {
                        firebase
                            .firestore()
                            .collection("posts")
                            .where('topic', '==', currentTopic)
                            .orderBy('createdAt', 'desc')
                            .startAfter(lastPostSnapshotRef.current)
                            .limit(2)
                            .get()
                            .then((collectionSnapshot) => {
                                const data = collectionSnapshot.docs.map((docSnapshot) => {
                                    const id = docSnapshot.id;
                                    return { ...docSnapshot.data(), id };
                                });
                                lastPostSnapshotRef.current =
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                        setPosts([...posts, ...data]);
                            });
                    } else {
                        firebase
                            .firestore()
                            .collection("posts")
                            .orderBy('createdAt', 'desc')
                            .startAfter(lastPostSnapshotRef.current)
                            .limit(2)
                            .get()
                            .then((collectionSnapshot) => {
                                const data = collectionSnapshot.docs.map((docSnapshot) => {
                                    const id = docSnapshot.id;
                                    return { ...docSnapshot.data(), id };
                                });
                                lastPostSnapshotRef.current =
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                                setPosts([...posts, ...data]); //將原本的post跟新拿到的陣列解構
                            });
                    }
                }

            }} />
        </>
    );
}

export default Posts;
