import { Item, Header } from "semantic-ui-react";
import { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import 'firebase/compat/firestore';
import Post from "../components/Post";



function MyCollections() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        firebase
            .firestore()
            .collection("posts")
            .where('collectedBy', 'array-contains', firebase.auth().currentUser.uid) //where:取得某個集合下的條件
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map((docSnapshot) => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id };
                })
                setPosts(data);
            })
    }, [])
    return (
        <>
            <Header>我的收藏</Header>
            <Item.Group>
                {posts.map((post) => {
                    return (
                        <Post post={post} key={post.id} />

                    );
                })}
            </Item.Group>
        </>
    );
}

export default MyCollections;