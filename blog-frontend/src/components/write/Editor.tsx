import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
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
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
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

type PayLoadProps = {
  key: string;
  value: string;
};
type Props = {
  title: string;
  body: string;
  onChangeField: (payload: PayLoadProps) => void;
};
const Editor = ({ title, body, onChangeField }: Props) => {
  const quillElement = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill>();

  useEffect(() => {
    if (quillElement.current) {
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

      //quill에 text-change 이벤트 핸들러 등록
      //참고: https://quilljs.com/docs/api#events
      const quill = quillInstance.current;
      quill.on('text-change', (delta, oldContents, source) => {
        if (source === 'user') {
          onChangeField({ key: 'body', value: quill.root.innerHTML });
        }
      });
    }
  }, [onChangeField]);

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = body;
    }
  }, [body]);

  const onChangeTitle = (e: React.FormEvent<HTMLInputElement>) => {
    onChangeField({ key: 'title', value: e.currentTarget.value });
  };

  return (
    <EditorBlock>
      <TitleInput
        placeholder="제목을 입력하세요"
        onChange={onChangeTitle}
        value={title}
      />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;
