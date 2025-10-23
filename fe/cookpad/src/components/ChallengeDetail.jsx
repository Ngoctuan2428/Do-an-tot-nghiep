import { useParams } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const ChallengeDetail = () => {
  const challenges = [
    {
      id: 1,
      img: 'https://thumbs.dreamstime.com/b/cooking-master-competition-vector-illustration-53111191.jpg',
      title: 'Thử thách nấu món chay 7 ngày',
      daysLeft: 3,
      number: 8723,
    },
    {
      id: 2,
      img: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chef-cooking-channel-youtube-banner-design-template-34ca10abd27afc282c16b6d2864cff25_screen.jpg?ts=1665921135',
      title: 'Nấu 5 món mới trong tuần',
      daysLeft: 5,
      number: 1293,
    },
    {
      id: 3,
      img: 'https://content.instructables.com/FPX/RK1O/IPWWVZYC/FPXRK1OIPWWVZYC.jpg?auto=webp',
      title: 'Thử món Á trong 3 ngày',
      daysLeft: 1,
      number: 353,
    },
  ];

  const { challengeSlug } = useParams();

  const challenge = challenges.find(
    (c) => c.title.replace(/\s+/g, '-') === challengeSlug
  );

  if (!challenge) {
    return <div className="p-8">Không tìm thấy thử thách.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <img
        src={challenge.img}
        alt={challenge.title}
        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
      />
      <div className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {challenge.title}
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-600 mt-4 gap-2">
          <span className="text-lg">
            Thời gian còn lại: {challenge.daysLeft} ngày
          </span>
          <span className="text-cookpad-orange flex items-center text-lg">
            <ChefHat className="inline-block mr-2" size={24} />
            {challenge.number} món đã tham gia
          </span>
        </div>
        <div className="mt-6 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-3">Mô tả thử thách</h2>
          <p className="text-gray-700 leading-relaxed">
            Đây là nội dung mô tả chi tiết cho thử thách "{challenge.title}".
            Hãy tham gia và chia sẻ những công thức nấu ăn tuyệt vời của bạn với
            cộng đồng Cookpad. Đừng quên rủ bạn bè cùng tham gia nhé!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
