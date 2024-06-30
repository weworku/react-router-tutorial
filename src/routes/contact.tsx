import { Form, useLoaderData } from "react-router-dom";
import { getContact } from "../contacts";

export async function loader({ params }: { params: any }) {
  const contact = await getContact(params.contactId);
  return { contact };
}
export type Contact = {
  contactId: string;
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  favorite: boolean;
};

/**
 * 連絡先情報をレンダリングします。
 * @returns 連絡先情報を表すJSX要素です。
 */
export default function Contact() {
  const contact = useLoaderData() as Contact;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || undefined}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type Props = Contact;
/**
 * お気に入りボタンを表示するためのコンポーネントです。
 *
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Object} props.contact - 連絡先オブジェクト。
 * @param {boolean} props.contact.favorite - 連絡先がお気に入りかどうかを示します。
 * @returns {JSX.Element} お気に入りボタンのコンポーネント。
 */
function Favorite({ contact }: { contact: Props }) {
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}