import Link from 'next/link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function LinkInNewWindow({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} style={{ display: 'flex', alignContent: 'center' }} target="_blank">
      {text} <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
    </Link>
  );
}
