import { ArrowLeft, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChallengeItem from '../components/ChallengeItem';

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

export default function Challenges() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Challenges Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Danh sách thử thách
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <ChallengeItem
                key={challenge.id}
                img={challenge.img}
                title={challenge.title}
                daysLeft={challenge.daysLeft}
                number={challenge.number}
              />
            ))}
          </ul>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-2 pl-4">
          <p className="p-2 font-semibold text-lg text-gray-700">
            0 thử thách sắp diễn ra
          </p>
          <p className="p-2 font-semibold text-lg text-gray-700">
            0 thử thách đã qua
          </p>
        </div>
      </div>
    </div>
  );
}
