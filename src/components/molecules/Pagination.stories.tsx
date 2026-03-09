import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = { title: 'Molecules/Pagination', component: Pagination };
export default meta;

export const Default = {
  render: () => {
    const [p, setP] = useState(1);
    return <Pagination page={p} total={10} onChange={setP} />;
  },
};

export const MiddlePage = {
  render: () => {
    const [p, setP] = useState(5);
    return <Pagination page={p} total={20} onChange={setP} />;
  },
};

export const ManyPages = {
  render: () => {
    const [p, setP] = useState(8);
    return <Pagination page={p} total={50} siblings={2} onChange={setP} />;
  },
};

export const FewPages = {
  render: () => {
    const [p, setP] = useState(1);
    return <Pagination page={p} total={3} onChange={setP} />;
  },
};

export const LastPage = {
  render: () => {
    const [p, setP] = useState(10);
    return <Pagination page={p} total={10} onChange={setP} />;
  },
};
