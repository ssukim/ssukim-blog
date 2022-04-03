import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UserInfo } from '../../lib/api/auth';
import { ReadPostInfo } from '../../lib/api/posts';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;

const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  /* 맨 위 포스트는 padding-top 없음 */
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }
  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;

type PostListProps = {
  posts: Array<ReadPostInfo>;
  loading: boolean;
  error: Error | null;
  showWriteButton: UserInfo | null;
};

type PostItemProps = {
  post: ReadPostInfo;
};

const PostItem = ({ post }: PostItemProps) => {
  // console.log(post)
  const { title, body, tags, publishedDate, user, _id } = post;
  return (
    <PostItemBlock>
      <h2>
        <Link to={`/@${user.username}/${_id}`}>{title}</Link>
      </h2>
      <SubInfo
        username={user.username}
        publishedDate={new Date(publishedDate)}
      />
      <Tags tags={tags} />
      <p>{body}</p>
    </PostItemBlock>
  );
};

const PostList = ({
  posts,
  loading,
  error,
  showWriteButton,
}: PostListProps) => {
  if (error) {
    return <PostListBlock>에러가 발생했습니다.</PostListBlock>;
  }

  return (
    <PostListBlock>
      <WritePostButtonWrapper>
        {showWriteButton && (
          <Button
            cyan
            linkProps={{
              to: '/write',
            }}
          >
            새 글 작성하기
          </Button>
        )}
      </WritePostButtonWrapper>
      {loading && <p style={{ textAlign: 'center' }}>로딩중...</p>}
      {/* 로딩 중이 아니고, 포스트 배열이 존재할 때만 노출 */}
      {!loading && posts && (
        <div>
          {posts.map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
        </div>
      )}
    </PostListBlock>
  );
};

export default PostList;
