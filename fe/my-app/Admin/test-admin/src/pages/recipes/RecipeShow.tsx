import {
    Show,
    SimpleShowLayout,
    TextField,
    NumberField,
    DateField,
    UrlField,
    useRecordContext,
  } from 'react-admin';
  
  const SmartIngredientsField = () => {
    const record = useRecordContext(); 
    if (!record || !record.ingredients) return null;
  
    const ingredients = record.ingredients;
  
    if (!Array.isArray(ingredients) || ingredients.length === 0) return null;
  
    if (typeof ingredients[0] === 'object' && ingredients[0] !== null) {
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
  
  const SmartStepsField = () => {
    const record = useRecordContext();
    if (!record || !record.steps) return null;
  
    const steps = record.steps;
    if (!Array.isArray(steps) || steps.length === 0) return null;
  
    if (typeof steps[0] === 'object' && steps[0] !== null) {
      // Dạng 1: "Phở Bò" (Array of Objects)
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
      // Dạng 2: "Bánh rán" (Array of Strings)
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
  
  export const RecipeShow = () => (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="slug" />
        <TextField source="description" />
  
        <SmartIngredientsField />
        <SmartStepsField />
  
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