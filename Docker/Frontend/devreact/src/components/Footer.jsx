const today = new Date();
const year = today.getFullYear();

export default function Footer() {
  return (
    <footer>
      <p>
        Press Room - Advertising - Jobs - Conditions of Use - Privacy Policy
      </p>
      <p>All Rights Reserved © {year}</p>
    </footer>
  );
}
