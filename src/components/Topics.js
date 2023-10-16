import React, { useEffect, useState } from "react";
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';
import { List } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

function Topics() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentTopic = urlSearchParams.get("topic");
    const [topics, setTopics] = useState([]);
    useEffect(() => {
        firebase
            .firestore()
            .collection("topics")//抓集合名稱
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map((doc) => {
                    return doc.data();//取快照底下陣列的資料                
                });
                setTopics(data);
            });
    }, []);
    return (
        <List animated selection>
            {topics.map((topic) => {
                return (
                <List.Item
                    key={topic.name}
                    as={Link}
                    to={`/posts?topic=${topic.name}`}
                    active={currentTopic === topic.name}
                    >
                    {topic.name}
                </List.Item>
                );
            })}
        </List>
    );

}
export default Topics;