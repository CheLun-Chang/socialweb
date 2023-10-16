import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useNavigate } from "react-router-dom";

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topics, setTopics] = useState([]);
    const [topicName, setTopicName] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


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

    const options = topics.map((topic) => {
        return {
            text: topic.name,
            value: topic.name,
        };
    });

    const previewUrl = file ? URL.createObjectURL(file) : "https://react.semantic-ui.com/images/wireframe/image.png"
    //有file的情況產生URL網址，沒有的話用預設的

    function onSubmit() {
        setIsLoading(true);
        const documentRef = firebase.firestore().collection("posts").doc();
    
        if (file) {
            const fileRef = firebase.storage().ref('post-images/' + documentRef.id);
            const metadata = {
                contentType: file.type
            };
            fileRef.put(file, metadata).then(() => {
                fileRef.getDownloadURL().then((imageUrl) => {
                    documentRef
                        .set({
                            title,
                            content,
                            topic: topicName,
                            createdAt: firebase.firestore.Timestamp.now(),
                            author: {
                                displayName: firebase.auth().currentUser.displayName || '',
                                photoURL: firebase.auth().currentUser.photoURL || '',
                                uid: firebase.auth().currentUser.uid,
                                email: firebase.auth().currentUser.email,
                            },
                            imageUrl,
                        })
                        .then(() => {
                            setIsLoading(false);
                            navigate('/posts');
                        })
                        .catch(error => console.error("Error writing post data:", error));
                })
            }).catch(error => console.error("Error uploading image:", error));
        } else {
            // 如果没有上传图片，直接写入文章数据
            documentRef
                .set({
                    title,
                    content,
                    topic: topicName,
                    createdAt: firebase.firestore.Timestamp.now(),
                    author: {
                        displayName: firebase.auth().currentUser.displayName || '',
                        photoURL: firebase.auth().currentUser.photoURL || '',
                        uid: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email,
                    },
                })
                .then(() => {
                    setIsLoading(false);
                    navigate('/posts');
                })
        }
    }
    
    return (
        <Container>
            <Header>發表文章</Header>
            <Form onSubmit={onSubmit}>
                <Image src={previewUrl}
                    size="small"
                    floated="left"
                    
                />
                <Button basic as="label" htmlFor="post-image">上傳文章圖片</Button>
                <Form.Input type="file" id="post-image"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files[0])} />
                <Form.Input
                    placeholder="輸入文章標題"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Form.TextArea
                    placeholder="輸入文章內容"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Form.Dropdown
                    placeholder="選擇文章主題"
                    options={options}
                    selection
                    value={topicName}
                    onChange={(e, { value }) => setTopicName(value)}
                />
                <Form.Button loading={isLoading}>送出</Form.Button>
            </Form>
        </Container>
    );
}
export default NewPost