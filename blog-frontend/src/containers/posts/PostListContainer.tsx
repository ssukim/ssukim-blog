import React, { FunctionComponent, useEffect } from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import PostList from '../../components/post/PostList';
import { RouteComponentProps, withRouter } from 'react-router';
import { listPostsAsync } from '../../modules/posts';

const PostListContainer: FunctionComponent<RouteComponentProps> = ({
  location
}: any) => {
  const dispatch = useDispatch();
  const { posts, error, loading, user } = useSelector((state: RootState) => ({
    posts: state.posts.posts,
    error: state.posts.listPostsError,
    loading: state.posts.loading,
    user: state.user.user,
  }));
  // console.log(location)
  useEffect(() => {
    const { tag, username, page }: any = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    dispatch(listPostsAsync.request({tag, username, page}));
  }, [dispatch, location.search]);

  return (
    <PostList
      loading={loading}
      error={error}
      posts={posts}
      showWriteButton={user}
    />
  );
};

export default withRouter(PostListContainer);
