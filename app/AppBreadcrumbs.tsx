import { Breadcrumbs, Link, LinkProps, Typography } from '@mui/material';
import routes from 'app/routes';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const ignoreHrefs = ['/auth', '/access-tokens', '/access-tokens/success'];

interface LinkRouterProps extends LinkProps {
  href: string;
  replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={NextLink as any} />;
}

export default function AppBreadcrumbs() {
  const pathname = usePathname();
  const pathnames = pathname?.split('/').filter((x) => x) || [];
  const HomeIcon = routes[0].icon;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
        {HomeIcon && <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />}
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const pathHref = `/${pathnames.slice(0, index + 1).join('/')}`;

        if (ignoreHrefs.includes(pathHref)) {
          // Just ignore, there is no bread crumb for this
          return null;
        }

        const route = routes.find((route) => {
          if (route.href === pathHref) return true;
          if (route.regex) {
            return new RegExp(route.href).test(pathHref);
          }
          return false;
        });
        if (!route) {
          console.error('Could not find route for breadcrumb', {
            pathHref,
            value,
            pathnames,
          });
          return null;
        }

        const { href, name, icon: Icon } = route;

        return last ? (
          <Typography color="text.primary" key={href} sx={{ display: 'flex', alignItems: 'center' }}>
            {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
            {name}
          </Typography>
        ) : (
          <LinkRouter
            underline="hover"
            color="inherit"
            href={href}
            key={href}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
            {name}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
}
