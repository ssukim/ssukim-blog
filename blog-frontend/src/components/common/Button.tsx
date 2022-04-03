import React from 'react';
import styled, { css } from 'styled-components';
import { Link, LinkProps } from 'react-router-dom';
import palette from '../../lib/styles/palette';

type ButtonProps = {
  fullWidth?: boolean;
  cyan?: boolean;
  disabled?: boolean;
  linkProps?: LinkProps;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonStyle = css<ButtonProps>`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  background: ${palette.gray[8]};
  cursor: pointer;
  &:hover {
    background: ${palette.gray[6]};
  }

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${({ cyan }) =>
    cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      background: ${palette.gray[3]};
      color: ${palette.gray[5]};
      cursor: not-allowed;
      &:hover {
        background: ${palette.gray[3]};
      }
    `}
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle}
`;

const Button = (props: ButtonProps) => {
  return (
    <>
      {props.linkProps && !props.disabled ? (
        <StyledLink
          to={props.linkProps.to}
          fullWidth={props.fullWidth}
          cyan={props.cyan}
          disabled={props.disabled}
        >
          {props.children}
        </StyledLink>
      ) : (
        <StyledButton
          fullWidth={props.fullWidth}
          cyan={props.cyan}
          disabled={props.disabled}
        >
          {props.children}
        </StyledButton>
      )}
    </>
  );
};

export default Button;
