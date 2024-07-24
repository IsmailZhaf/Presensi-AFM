import React from 'react';
import { SideNav } from './_components/SideNav';

function layout({ children }) {
  return (
    <div className="">
      <div className="md:w-64 md:block">
        <SideNav />
      </div>
      <div className="md:ml-64 pt-5 md:pt-0">{children}</div>
    </div>
  );
}

export default layout;
