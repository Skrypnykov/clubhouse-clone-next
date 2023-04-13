import React from 'react';
import Link from 'next/link';

import { Avatar } from '@/components';

export type SpeakerProps = {
  id: string;
  fullname: string;
  avatarUrl: string;
};

export const Speaker: React.FC<SpeakerProps> = ({ id, fullname, avatarUrl }) => {
  return (
    <Link href={`/profile/${id}`}>
      <a className="d-i-flex flex-column align-items-center mr-40 mb-40">
        <Avatar src={avatarUrl} height="100px" width="100px" />
        <div className="mt-10">
          <b>{fullname}</b>
        </div>
      </a>
    </Link>
  );
};
