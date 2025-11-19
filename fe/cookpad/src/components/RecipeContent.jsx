import { Users, Clock } from 'lucide-react';

export default function RecipeContent({ recipe }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
      {/* Nguyên liệu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Nguyên Liệu</h2>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" /> {recipe.servings}
          </div>
        </div>

        <ul className="space-y-2">
          {recipe.ingredients.map((item, i) =>
            item.group ? (
              <li key={i}>
                <p className="font-semibold">{item.group}</p>
                <ul className="ml-4 list-disc text-gray-700">
                  {item.items.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={i} className="flex justify-between">
                <span>{item.amount}</span>
                <span>{item.name}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Hướng dẫn */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Hướng dẫn cách làm</h2>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" /> {recipe.time}
          </div>
        </div>

        <ol className="space-y-6">
          {recipe.steps.map((step, i) => (
            <li key={i}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <p className="text-gray-800 flex-1">{step.text}</p>
              </div>
              {step.images && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {step.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
