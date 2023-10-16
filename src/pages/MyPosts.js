import { Item, Header } from "semantic-ui-react";
import { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import 'firebase/compat/firestore';
import Post from "../components/Post";



function MyPosts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        firebase
            .firestore()
            .collection("posts")
            .where("author.uid", "==", firebase.auth().currentUser.uid)
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id };
                })
                setPosts(data);
            })
    }, [])
    return (
        <>
            <Header>我的文章</Header>
            <Item.Group>
                {posts.map(post => {
                    return (
                        <Post post={post} key={post.id} />

                    );
                })}
            </Item.Group>
        </>
    );
}

export default MyPosts;