import BookDetail from '@/components/BookDetail';
import FormEdit from '@/components/FormEdit';
import { getBookById, getReviewById } from '@/lib/getter';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function EditPage({ params }: Props) {
  const book = await getBookById(params.id);
  const review = await getReviewById(params.id);
  const read = (review?.read || new Date()).toLocaleDateString('sv-SE');
  // const read = (review?.read || new Date()).toLocaleDateString('ja-JP',
  //   { year: 'numeric', month: '2-digit', day: '2-digit' }
  // ).replaceAll('/', '-')

  return (
    <>
      <BookDetail book={book} />
      <FormEdit src={{ id: book.id, read, memo: review?.memo ? review?.memo : '' }} />
    </>
  );
}
