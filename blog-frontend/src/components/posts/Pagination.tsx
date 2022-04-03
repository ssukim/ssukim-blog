import React from 'react';
import styled from 'styled-components';
import qs from 'qs';
import Button from '../common/Button';

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
`;
const PageNumber = styled.div``;

const buildLink = ({ username, tag, page }: any) => {
  const query = qs.stringify({ tag, page });
  return username ? `/@${username}?${query}` : `/?${query}`;
};

const Pagination = ({ page, lastPage, username, tag }: any) => {
  // console.log('page: ' + page);
  // console.log('lastPage: ' + lastPage);
  return (
    <PaginationBlock>
      <Button
        disabled={page === 1}
        linkProps={{
          to: page === 1 ? '' : buildLink({ username, tag, page: page - 1 }),
        }}
      >
        이전
      </Button>
      <PageNumber>{page}</PageNumber>
      <Button
        disabled={page === lastPage}
        linkProps={{
          to:
            page === lastPage
              ? ''
              : buildLink({ username, tag, page: page + 1 }),
        }}
      >
        다음
      </Button>
    </PaginationBlock>
  );
};

export default Pagination;
