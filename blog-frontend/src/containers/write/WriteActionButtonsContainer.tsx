import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import WriteActionButtons from '../../components/write/WriteActionButtons';
import { RootState } from '../../modules';
import { writeAsync } from '../../modules/write';

const WriteActionButtonsContainer: FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const dispatch = useDispatch();
  const { title, body, tags, post, postError } = useSelector(
    (state: RootState) => ({
      title: state.write.title,
      body: state.write.body,
      tags: state.write.tags,
      post: state.write.post,
      postError: state.write.postError,
    }),
  );

  // 포스트 등록
  const onPublish = () => {
    dispatch(
      writeAsync.request({
        title,
        body,
        tags,
      }),
    );
  };

  // 취소
  const onCancel = () => {
    history.goBack();
  };

  // 성공 혹은 실패 시 할 작업
  useEffect(() => {
    if (post) {
      const { _id, user }: any = post;
      history.push(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [history, post, postError]);

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};

export default withRouter(WriteActionButtonsContainer);
