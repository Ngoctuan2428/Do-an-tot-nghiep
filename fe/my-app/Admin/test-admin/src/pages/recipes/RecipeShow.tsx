import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  UrlField,
  useRecordContext,
} from 'react-admin';

interface SmartIngredientsFieldProps {
  source: string;
}

const SmartIngredientsField = ({ source }: SmartIngredientsFieldProps) => {
  const record = useRecordContext();
  if (!record || !source || !record[source]) return null;

  const ingredients = record[source];

  if (!Array.isArray(ingredients) || ingredients.length === 0) return null;

  if (typeof ingredients[0] === 'object' && ingredients[0] !== null) {
    // Xử lý trường hợp mảng các đối tượng: [{ name: "...", amount: "..." }]
    return (
      <ul className="ml-5 list-disc">
        {ingredients.map((item: any, index: number) => (
          <li key={index}>
            <strong>{item.name}:</strong> {item.amount}
          </li>
        ))}
      </ul>
    );
  } else if (typeof ingredients[0] === 'string') {
    // Xử lý trường hợp mảng các chuỗi: ["item 1", "item 2"]
    return (
      <ul className="ml-5 list-disc">
        {ingredients.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  return null;
};

interface SmartStepsFieldProps {
  source: string;
}

const SmartStepsField = ({ source }: SmartStepsFieldProps) => {
  const record = useRecordContext();
  if (!record || !source || !record[source]) return null;

  const steps = record[source];
  if (!Array.isArray(steps) || steps.length === 0) return null;

  if (typeof steps[0] === 'object' && steps[0] !== null) {
    // Xử lý trường hợp mảng các đối tượng: [{ step: 1, instruction: "..." }]
    return (
      <ol className="ml-5 list-decimal">
        {steps.map((item: any, index: number) => (
          <li key={index}>
            {item.instruction} (Bước {item.step})
          </li>
        ))}
      </ol>
    );
  } else if (typeof steps[0] === 'string') {
    // Xử lý trường hợp mảng các chuỗi: ["step 1", "step 2"]
    return (
      <ol className="ml-5 list-decimal">
        {steps.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }
  return null;
};

// Component chính để hiển thị chi tiết Recipe
export const RecipeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="description" />
      <SmartIngredientsField source="ingredients" />
      <SmartStepsField source="steps" />
      <TextField source="servings" />
      <UrlField source="image_url" />
      <NumberField source="likes" />
      <NumberField source="views" />
      <TextField source="difficulty" />
      <TextField source="status" />
      <DateField source="created_at" showTime />
      <DateField source="updated_at" showTime />
      <TextField source="User.username" label="Author" />
    </SimpleShowLayout>
  </Show>
);