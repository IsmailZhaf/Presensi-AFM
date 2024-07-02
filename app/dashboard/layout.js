import React from 'react';
import { SideNav } from './_components/SideNav';

function layout({ children }) {
  return (
    <div>
      <div className="md:w-64 md:block fixed">
        <SideNav />
      </div>
      <div className="md:ml-64">{children}</div>
    </div>
  );
}

export default layout;
