import styled from "styled-components";

const Style = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  font-family: "title";
  font-size: 2rem;

  color: var(--text-content);
  transition: 0.2s ease;

  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    text-decoration: underline;
    color: var(--text-accent);
  }
`

interface Props {
  title: string;
  className?: string;
}

export function Title({ title, className = "" }: Props) {
  return <Style className={`Title ${className}`}>{title}</Style>;
}
