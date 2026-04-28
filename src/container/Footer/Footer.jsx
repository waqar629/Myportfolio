import React, { useState } from 'react';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import { client } from '../../client';
import { getCopy } from '../../locales';
import './Footer.scss';

const Footer = ({ language }) => {
  const copy = getCopy(language);
  const [formData, setFormData] = useState({ username: '', email: '', message: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { username, email, message } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);

    const contact = {
      _type: 'contact',
      name: formData.username,
      email: formData.email,
      message: formData.message,
    };

    client.create(contact)
      .then(() => {
        setLoading(false);
        setIsFormSubmitted(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h2 className="head-text">{copy.footer.title}</h2>

      <div className="app__footer-cards">
        <div className="app__footer-card ">
          <img src={images.email} alt="email" />
          <a href="https://wa.link/fwe1c2" className="p-text" target='blank'>waqarhassan630@gmail.com</a>
        </div>
        <div className="app__footer-card">
          <img src={images.mobile} alt="phone" />
          <a href="https://wa.link/fwe1c2" className="p-text" target='blank'>+49 1523 1383828</a>
        </div>
      </div>
      {!isFormSubmitted ? (
        <div className="app__footer-form app__flex">
          <div className="app__flex">
            <input className="p-text" type="text" placeholder={copy.footer.placeholders.name} name="username" value={username} onChange={handleChangeInput} />
          </div>
          <div className="app__flex">
              <input className="p-text" type="email" placeholder={copy.footer.placeholders.email} name="email" value={email} onChange={handleChangeInput} />
          </div>
          <div>
            <textarea
              className="p-text"
                placeholder={copy.footer.placeholders.message}
              value={message}
              name="message"
              onChange={handleChangeInput}
            />
          </div>
            <button type="button" className="p-text" onClick={handleSubmit}>{!loading ? copy.footer.submit : copy.footer.submitting}</button>
        </div>
      ) : (
        <div>
          <h3 className="head-text">
              {copy.footer.success}
          </h3>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
