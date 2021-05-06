import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TagBox from '../../components/write/TagBox';
import { RootState } from '../../modules';
import { changeField } from '../../modules/write';

const TagBoxContainer = () => {
  const dispatch = useDispatch();
  const {tags} = useSelector((state: RootState) => ({
    tags: state.write.tags,
  }));

  const onChangeTags = (nextTags: string) => {
    dispatch(
      changeField({
        key: 'tags',
        value: nextTags,
      }),
    );
  };

  return <TagBox tags={tags} onChangeTags={onChangeTags} />
};

export default TagBoxContainer;