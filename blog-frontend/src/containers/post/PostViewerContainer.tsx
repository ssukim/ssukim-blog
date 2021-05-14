import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import PostActionButtons from '../../components/post/PostActionButtons';
import PostViewer from '../../components/post/PostViewer';
import { removePost } from '../../lib/api/posts';
import { RootState } from '../../modules';
import { readPostAsync, unloadPost } from '../../modules/post';
import { setOriginalPost } from '../../modules/write';

const PostViewerContainer: FunctionComponent<RouteComponentProps> = ({
  match,
  history,
}: any) => {
  // 처음 마운트될 때 포스트 읽기 api 요청
  const { postId } = match.params;
  const dispatch = useDispatch();
  const { post, error, loading, user } = useSelector((state: RootState) => ({
    post: state.post.post,
    error: state.post.readError,
    loading: state.post.loading,
    user: state.user.user,
  }));

  useEffect(() => {
    dispatch(readPostAsync.request(postId));
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    history.push('/write');
  };

  const onRemove = async () => {
    try {
      await removePost(postId);
      history.push('/'); // 홈으로 이동
    } catch (e) {
      console.log(e);
    }
  };

  const ownPost = (user && user._id) === (post && post.user._id);

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove}/>}
    />
  );
};

export default withRouter(PostViewerContainer);
