import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';

type SubInfoProps = {
  username: string;
  publishedDate: Date;
  hasMarginTop?: boolean;
};

const SubInfoBlock = styled.div<{ $hasMarginTop: boolean }>`
  color: ${palette.gray[6]};
  margin-top: ${({ $hasMarginTop }) => $hasMarginTop && '1rem'};
`;

const SubInfo = ({ username, publishedDate, hasMarginTop }: SubInfoProps) => {
  return (
    <SubInfoBlock $hasMarginTop={hasMarginTop || false}>
      <span>
        <b>
          <Link to={`/@${username}`}>{username + ' '}</Link>
        </b>
      </span>
      <span>{new Date(publishedDate).toLocaleDateString()}</span>
    </SubInfoBlock>
  );
};

export default SubInfo;
