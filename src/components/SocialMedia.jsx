import React from 'react';
import { BsLinkedin, BsGithub, BsInstagram} from 'react-icons/bs';


const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a href='https://www.linkedin.com/in/waqar-hassan628/' target='blank' >
            <BsLinkedin />
          </a>
    </div>
    <div>
      <a href='https://github.com/waqar629' target='blank'>
            <BsGithub />
          </a>
    </div>
    <div>
      <a href='https://www.instagram.com/evil_genius007/' target='blank'>
            <BsInstagram />
          </a>
    </div>

  </div>
);

export default SocialMedia;
