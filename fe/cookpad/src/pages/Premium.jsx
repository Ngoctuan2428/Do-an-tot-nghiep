import { useForm } from 'react-hook-form';
import { Check, CreditCard, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  { id: 1, title: 'Top món chỉ bạn thấy', checked: true },
  { id: 2, title: 'Bỏ quảng cáo', checked: true },
  { id: 3, title: 'Top món bạn duyệt chỉ thịnh', checked: true },
  { id: 4, title: 'Bỏ tích phân cao dữ liệu', checked: true },
  { id: 5, title: 'Gợi ý đặc hàm ngay bạn thích', checked: true },
];

const PricingCard = () => (
  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
        <span className="text-yellow-800 font-bold text-lg">G</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Gói Premium 1 tháng</h3>
        <p className="text-sm text-gray-600">Giao phí</p>
      </div>
    </div>
    <div className="text-center mb-4">
      <p className="text-3xl font-bold text-yellow-600">25.000đ</p>
      <p className="text-sm text-gray-500">/tháng</p>
    </div>
    <p className="text-sm text-gray-700 text-center mb-6">
      Phí lý tính tháng, bạn sẽ được hưởng lợi ích từ gói cao cấp của Cookpad.
    </p>
  </div>
);

const PaymentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Thanh toán:', data); // TODO: Integrate API thanh toán (VNPay, Momo, etc.)
    navigate('/premium/success'); // Redirect to success page
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <CreditCard size={16} className="mr-2 text-gray-500" />
          Thẻ tín dụng
        </label>
        <input
          type="text"
          placeholder="Số thẻ"
          {...register('cardNumber', {
            required: 'Số thẻ bắt buộc',
            pattern: { value: /^\d{13,19}$/, message: 'Số thẻ không hợp lệ' },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
        />
        {errors.cardNumber && (
          <p className="text-xs text-red-500 mt-1">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Hạn sử dụng
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            {...register('expiry', {
              required: 'Hạn sử dụng bắt buộc',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: 'Định dạng MM/YY',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange text-xs"
          />
          {errors.expiry && (
            <p className="text-xs text-red-500 mt-1">{errors.expiry.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            placeholder="CVV"
            {...register('cvv', {
              required: 'CVV bắt buộc',
              pattern: { value: /^\d{3,4}$/, message: 'CVV 3-4 chữ số' },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange text-xs"
          />
          {errors.cvv && (
            <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên trên thẻ
        </label>
        <input
          type="text"
          placeholder="Tên đầy đủ"
          {...register('name', { required: 'Tên bắt buộc' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition-colors font-medium flex items-center justify-center"
      >
        <Lock size={16} className="mr-2" />
        Thanh toán bằng Thẻ tín dụng
      </button>
    </form>
  );
};

export default function Premium() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-5/6 mx-auto px-4">
        {/* Header */}
        {/* <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Premium</h1>
        </div> */}

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Premium giúp bạn nấu ngon hơn
          </h2>
          <ul className="space-y-3 mb-6">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-start">
                <Check
                  size={20}
                  className="text-green-500 mt-0.5 mr-3 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{benefit.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <PricingCard />

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          Bằng cách đăng ký Gold Premium, bạn sẽ có trải nghiệm tốt hơn với
          Cookpad.
        </p>

        {/* Payment */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Chọn phương thức thanh toán
          </h3>
          <PaymentForm />
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <button className="text-cookpad-orange underline hover:no-underline">
            Điều khoản Dịch vụ
          </button>{' '}
          của Cookpad.
        </p>
      </div>
    </div>
  );
}
