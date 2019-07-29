import React from 'react';
import SideNavigation from '../side_navigation';
import MainContent from '../main_content';

function Dashboard () {
  return (
    <div className='row'>
      <div className='col-2'>
        <SideNavigation />
      </div>
      <div className='col-10'>
        <MainContent />
      </div>
    </div>
  );
}

export default Dashboard;
