import RecipeHeader from '../components/RecipeHeader';
import RecipeContent from '../components/RecipeContent';
import CooksnapSection from '../components/CooksnapSection';
import RelatedRecipes from '../components/RelatedRecipes';

export default function RecipeDetail() {
  // Mock data để bạn gắn API sau này
  const recipe = {
    id: 24712741,
    title: 'Thịt Xíu Mè',
    description: 'Thịt xíu mè, nhiều mè 1 chút ăn kèm bánh mì siêu ngon',
    servings: '5 người',
    time: '45 phút',
    cooks: 8,
    author: {
      name: 'Bòn Bon @bonbonhcm',
      avatar:
        'https://img-global.cpcdn.com/users/cf350f88589e7075/80x80cq50/avatar.webp',
      location: 'Hồ Chí Minh - Việt Nam',
      joined: '3 tháng 10 năm 2025',
      bio: 'Mình gia nhập Cookpad từ năm 2017. Đây là nơi lưu giữ các món mình đã nấu.',
    },
    hashtag: '#10nam1hanhtrinh',
    image:
      'https://images.prismic.io/orientalmart/Znw3lZbWFbowe4bJ_Untitleddesign-5-.jpg?auto=format,compress',
    ingredients: [
      { amount: '500 gr', name: 'Thịt ba rọi rút sườn' },
      { amount: '50 gr', name: 'Mè trắng' },
      { amount: '2 muỗng canh', name: 'Hành tím băm' },
      {
        group: 'Gia vị ướp thịt',
        items: [
          '4 muỗng cafe nước tương',
          '2 muỗng cafe dầu hào',
          '2 muỗng cafe đường thốt nốt',
          '1/2 muỗng cafe muối',
          '2 muỗng cafe nước mắm',
          '1 muỗng cafe hắc xì dầu / nước màu',
        ],
      },
    ],
    steps: [
      {
        text: 'Trụng sơ thịt với hành tím, rượu, gốc hành. Cắt mỏng và ướp 30 phút.',
        images: [
          'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
          'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
          'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
        ],
      },
      {
        text: 'Mè rang vàng thơm.',
        images: [
          'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
        ],
      },
      {
        text: 'Phi hành tím, cho thịt vào xào, đậy nắp 15 phút cho chín.',
        images: [
          'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
        ],
      },
    ],
    related: [
      {
        title: 'Thịt xá xíu đơn giản',
        img: 'https://content.jdmagicbox.com/comp/def_content_category/asian-fusion-restaurants/16686899682-asian-fusion-restaurants-6-ytd2q.jpg',
        desc: 'Món thịt xá xíu đơn giản, dễ làm tại nhà.',
        author: 'Mai Mai',
      },
      {
        title: 'Thịt xá xíu BBQ',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Cw8V0mIR1FZL_ppzpxgfCbCSAfgmNC2IMmxD-WS8c4IZQZ9qJyBnwDHfJxAHru6qCd8&usqp=CAU',
        desc: 'Thịt xá xíu đậm vị BBQ, cực kỳ hấp dẫn.',
        author: 'Bếp Nhỏ',
      },
      {
        title: 'Bánh mì xíu mại',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf9TUEhB7IFA3Zg7wlZ9aNjW6p5cZfI1wN3w&s',
        desc: 'Bánh mì xíu mại thơm ngon như ngoài tiệm.',
        author: 'Minh Anh',
      },
    ],
  };

  return (
    <div className="bg-white text-gray-900">
      <RecipeHeader recipe={recipe} />
      <RecipeContent recipe={recipe} />
      <CooksnapSection recipe={recipe} />
      <RelatedRecipes recipes={recipe.related} />
    </div>
  );
}
