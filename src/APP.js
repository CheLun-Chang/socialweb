import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import { useEffect, useState } from "react";

import firebase from './utils/firebase';

import Header from "./Header";

import Signin from "./pages/Signin";
import Posts from "./pages/Posts";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import MyPosts from "./pages/MyPosts";
import MyCollections from "./pages/MyCollections";
import MySettings from "./pages/MySettings";

import Topics from "./components/Topics";
import MyMenu from "./components/MyMenu";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    })
  },[]) //只在最上層做監聽，其他compoments透過user的prop來監聽

  return (
    <BrowserRouter>
      <Header user={user}/>
      <Routes>
        <Route exact path="/posts" element={<PostViewLayout />}>
          <Route path="/posts" element={<Posts />} exact />
          <Route path="/posts/:postId" element={user !== null ? <Post /> : <Navigate to="/posts" /> } exact />
        </Route>

        <Route path="/my" element={user !== null ? <MyViewLayout /> : <Navigate to="/posts" />}>
         
          <Route path="/my/posts" element={<MyPosts />} exact />
          <Route path="/my/collections" element={<MyCollections />} exact />
          <Route path="/my/settings" element={<MySettings user={user} />} exact />

        </Route>


        <Route exact path="/signin" element={user !== null ? <Navigate to="/posts" /> : <Signin />} />
        <Route exact path="/new-post" element={user !== null ? <NewPost /> : <Navigate to="/posts" />} />
        <Route exact path="posts/:postId" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

const PostViewLayout = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Topics />
          </Grid.Column>
          <Grid.Column width={10}>
            <Outlet />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const MyViewLayout = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    })
  },[])
  return (
     
 
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MyMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Outlet />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    
    
  );
};

export default App;