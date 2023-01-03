export const updateText = async (
  id,
  title,
  abstract,
  explanation,
  category1,
  category2,
  price,
  learningContents,
  learningRequirements,
  authAxios,
) => {
  try {
    const res = await authAxios.put('/api/texts/' + id, {
      title: title,
      abstract: abstract,
      explanation: explanation,
      category1: category1,
      category2: category2,
      price: price,
      learning_contents: learningContents,
      learning_requirements: learningRequirements,
    });

    if (res.data.status == 'ok') {
      return { textId: res.data.text_id };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: error };
  }
};
