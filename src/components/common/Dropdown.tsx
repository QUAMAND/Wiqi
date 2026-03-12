import { useState } from "react";
import { Button } from "./Button";
import { Dot } from "./Dot";
import { Icon, IconKeys } from "./Icon";
import "./index.css";

/* 리스트 내부 아이템입니다 */
interface Item {
  key: string;
  value: string;
}

interface Props {
  icon?: IconKeys;
  items: Item[];
  onSelect?: (value: string) => void;
}

export function Dropdown({ icon, items, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="Dropdown">
      <Button className="Dropdown-button" onClick={() => setOpen((v) => !v)}>
        {icon && <Icon size={16} icon={icon} />}
        {selected?.value}
        <Icon icon="dropdown" size={16} className={`Dropdown-icon ${open}`} />
      </Button>

      {open && (
        <ul className="Dropdown-list">
          {items.map((item) => (
            <li key={item.key}>
              <Button
                className={`Dropdown-item ${
                  item.key === selected?.key ? "select" : ""
                }`}
                onClick={() => {
                  setSelected(item);
                  onSelect?.(item.key);
                  setOpen(false);
                }}
              >
                {item.key === selected?.key ? <Dot dot="green" /> : <Dot />}
                {item.value}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
