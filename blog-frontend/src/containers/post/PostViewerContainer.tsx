import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import PostViewer from '../../components/post/PostViewer';
import { RootState } from '../../modules';
import { readPostAsync, unloadPost } from '../../modules/post';

const PostViewerContainer:FunctionComponent<RouteComponentProps> = ({ match }: any) => {
  // 처음 마운트될 때 포스트 읽기 api 요청
  const { postId } = match.params;
  const dispatch = useDispatch();
  const { post, error, loading } = useSelector((state: RootState) => ({
    post: state.post.post,
    error: state.post.readError,
    loading: state.post.loading,
  }));

  useEffect(() => {
    dispatch(readPostAsync.request(postId));
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  return <PostViewer post={post} loading={loading} error={error}/>
};

export default withRouter(PostViewerContainer);
