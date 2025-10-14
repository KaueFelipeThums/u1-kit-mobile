import { PortalProvider } from '@/components/primitves/portal/portal-provider';
import PopConfirmProvider from '@/components/ui-presets/popconfirm';
import { SafeAreaProvider } from '@/components/ui/safe-area-content';
import { Toaster } from '@/components/ui/toast';
import Home from '@/pages/home/home';
import { ThemeProvider } from '@/theme/theme-provider/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <PortalProvider>
          <PopConfirmProvider>
            <Toaster>
              <Home />
            </Toaster>
          </PopConfirmProvider>
        </PortalProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
