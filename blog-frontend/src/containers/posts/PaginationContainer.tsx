import React, { FunctionComponent } from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import { RouteComponentProps, withRouter } from 'react-router';
import Pagination from '../../components/posts/Pagination';

const PaginationContainer: FunctionComponent<RouteComponentProps> = ({
  location,
}: any) => {
  const { lastPage, posts, loading } = useSelector((state: RootState) => ({
    lastPage: state.posts.lastPage,
    posts: state.posts.posts,
    loading: state.posts.loading,
  }));

  // 포스트 데이터가 없거나 로딩 중이면 아무것도 보여 주지 않음
  if (!posts || loading) return null;

  //   console.log('location.search:' + location.search);
  // page가 없으면 1을 기본값으로 사용
  const { tag, username, page = 1 }:any = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  return (
    <Pagination
      tag={tag}
      username={username}
      page={parseInt(page, 10)}
      lastPage={lastPage}
    />
  );
};

export default withRouter(PaginationContainer);
