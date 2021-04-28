import React, { useEffect, useRef } from 'react';
import Quill, {QuillOptionsStatic} from 'quill';
import 'quill/dist/quill.bubble.css';
import styled from 'styled-components';
import Responsive from '../common/Responsive';
import palette from '../../lib/styles/palette';

const EditorBlock = styled(Responsive)`
  /*페이지 위아래 여백 지정*/
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const TitleInput = styled.input`
    font-size: 3rem;
    outline: none;
    padding-bottom: 0.5rem;
    border: none;
    border-bottom: 1px solid ${palette.gray[4]}
    margin-bottom: 2rem;
    width: 100%
`;
const QuillWrapper = styled.div`
  /*최소 크기 지정 및 padding 제거*/
  .ql-editor {
    padding: 0;
    min-height: 320px;
    font-size: 1.125rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 0px;
  }
`;

type quillElement = {
  current: string | Element;
  options?:  QuillOptionsStatic | undefined
  // ref?: React.LegacyRef<HTMLDivElement> | undefined
};
type quillInstance = {
  current: string | Quill;
};

const Editor = () => {
  const quillElement:quillElement | any = useRef('');
  const quillInstance:quillInstance = useRef('');

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
      placeholder: '내용을 작성하세요...',
      modules: {
        toolbar: [
          [{ header: '1' }, { header: '2' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });
  }, []);

  return (
      <EditorBlock>
          <TitleInput placeholder="제목을 입력하세요"/>
          <QuillWrapper>
              <div ref={quillElement}/>
          </QuillWrapper>
      </EditorBlock>
  )
};

export default Editor;

