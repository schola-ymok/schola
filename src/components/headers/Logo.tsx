import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <a style={{ display: 'flex', alignItems: 'center' }}>
        <img src='/logo.png' />
      </a>
    </Link>
  );
};

export default Logo;
