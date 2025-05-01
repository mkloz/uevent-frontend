import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { App } from './app';
import { AuthLayout } from './modules/auth/layout/auth-layout';
import { ActivateAccountPage } from './modules/auth/pages/activate-account-page';
import { ForgotPasswordPage } from './modules/auth/pages/forgot-password-page';
import { LoginPage } from './modules/auth/pages/login-page';
import { ResetPasswordPage } from './modules/auth/pages/reset-password-page';
import { SignUpPage } from './modules/auth/pages/sign-up-page';
import { CompanyNewsDetailPage } from './modules/company/pages/companies-news-detals-page';
import { CompaniesPage } from './modules/company/pages/companies-page';
import { CompanyDetailPage } from './modules/company/pages/company-details-page';
import { EventPage } from './modules/event/pages/event-page';
import { EventsPage } from './modules/event/pages/events-page';
import { HomePage } from './modules/home/pages/home.page';
import { ActivateTicketPage } from './modules/ticket/pages/activate-ticket-page';
import { UserProfileLayout } from './modules/user/layouts/user-profile-layout';
import { UserFollowingCompaniesPage } from './modules/user/pages/user-following-companies-page';
import { UserFollowingEventsPage } from './modules/user/pages/user-following-events-page';
import { UserPastEventsPage } from './modules/user/pages/user-past-events-page';
import { UserSettingsPage } from './modules/user/pages/user-settings-page';
import { UserTicketsPage } from './modules/user/pages/user-tickets-page';
import { UserUpcomingEventsPage } from './modules/user/pages/user-upcoming-events-page';
import { AuthGuard } from './shared/guards/auth-guard';
import { NotFoundPage } from './shared/pages/not-found-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />
          },
          {
            path: 'activate/:token',
            element: <ActivateAccountPage />
          },
          {
            path: 'login',
            element: <LoginPage />
          },
          {
            path: 'sign-up',
            element: <SignUpPage />
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />
          },
          {
            path: 'reset-password/:token',
            element: <ResetPasswordPage />
          }
        ]
      },
      {
        path: 'users/:id',
        element: <UserProfileLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="upcoming" replace />
          },
          {
            path: 'upcoming',
            element: <UserUpcomingEventsPage />
          },
          {
            path: 'past',
            element: <UserPastEventsPage />
          },
          {
            path: 'following/companies',
            element: <UserFollowingCompaniesPage />
          },
          {
            path: 'following/events',
            element: <UserFollowingEventsPage />
          },
          {
            path: 'tickets',
            element: <UserTicketsPage />
          },
          {
            path: 'settings',
            element: <UserSettingsPage />
          }
        ]
      },
      { path: 'events', element: <EventsPage /> },
      {
        path: 'events/:id',
        element: <EventPage />
      },
      {
        path: 'companies',
        element: <CompaniesPage />
      },
      {
        path: 'companies/:id',
        element: <CompanyDetailPage />
      },
      {
        path: 'companies/news/:newsId',
        element: <CompanyNewsDetailPage />
      },
      {
        path: 'verify-ticket/:ticketId',
        element: (
          <AuthGuard>
            <ActivateTicketPage />
          </AuthGuard>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
