import styled, { css } from "styled-components";

const Style = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: none;
  border-radius: var(--radius-s);
  background: transparent;
  cursor: pointer;
  transition: background var(--transition);

  &:hover {
    background: var(--bg-raised);
  }

  span {
    height: 3px;
    display: block;
    border-radius: 2px;
    transform-origin: left center;
    transition: all 0.3s var(--bound);
  }
`;
const HamLine = styled.span<{ $color: string }>`
  background: ${(p) => p.$color};
`;
const OpenStyle = css`
  span:nth-child(1) { transform: rotate(45deg) scaleX(1.2); }
  span:nth-child(2) { opacity: 0; transform: scaleX(2); }
  span:nth-child(3) { transform: rotate(-45deg) scaleX(1.2); }
`;
const HamButton = styled(Style)<{ $open?: boolean }>`
  ${(p) => p.$open && OpenStyle}
`;

interface Props {
  open?: boolean;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Hamburger({ open = false, color = "var(--text-second)", className = "", onClick }: Props) {
  return (
    <HamButton $open={open} className={className} onClick={onClick}>
      <HamLine $color={color} />
      <HamLine $color={color} />
      <HamLine $color={color} />
    </HamButton>
  );
}