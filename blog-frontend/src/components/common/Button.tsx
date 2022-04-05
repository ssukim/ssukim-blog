import React from 'react';
import styled, { css } from 'styled-components';
import { Link, LinkProps } from 'react-router-dom';
import palette from '../../lib/styles/palette';

type StyledButtonProps = {
  $fullWidth?: boolean;
  $cyan?: boolean;
  $disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const buttonStyle = css<StyledButtonProps>`
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

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${({ $cyan }) =>
    $cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
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

type ButtonProps = {
  fullWidth?: boolean;
  cyan?: boolean;
  disabled?: boolean;
  linkProps?: LinkProps;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button = ({
  fullWidth,
  cyan,
  disabled,
  linkProps,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <>
      {linkProps && !disabled ? (
        <StyledLink
          to={linkProps.to}
          $fullWidth={fullWidth}
          $cyan={cyan}
          disabled={disabled}
        >
          {children}
        </StyledLink>
      ) : (
        <StyledButton
          $fullWidth={fullWidth}
          $cyan={cyan}
          disabled={disabled}
          {...rest}
        >
          {children}
        </StyledButton>
      )}
    </>
  );
};

export default Button;
