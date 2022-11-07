import React from 'react';
import { CloseIcon } from './SVG_Icons';
import Modal from 'react-modal';

const SolutionModal = ({ isSolutionShown, closeModal, solution }) => {
  Modal.setAppElement('#app');
  return (
    <Modal
      isOpen={isSolutionShown}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(255,255,255,0.1',
          backdropFilter: 'blur(8px)',
        },
      }}
      contentLabel='Example Modal'
      className='mx-auto mt-[96px] flex max-w-[60vw] flex-col overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl'>
      <div>
        <div className='flex justify-between border-b border-slate-700 px-8 py-5'>
          <h2 className='text-2xl'>Solution Code</h2>
          <button onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>
        <div className='min-h-[300px] bg-[#090e1a] p-8 font-mono text-slate-200'>
          {solution}
        </div>
      </div>
    </Modal>
  );
};

export default SolutionModal;
