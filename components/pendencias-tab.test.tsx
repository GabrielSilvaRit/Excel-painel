import { render, screen } from '@testing-library/react';
import PendenciasTab from './pendencias-tab';

// Mock data for testing
const mockPendencias = [
  {
    protocolo: '12345',
    cliente: 'Cliente A',
    titulo: 'Título A',
    solicitante: 'Solicitante A',
    abertura: '01/01/2023 12:00:00',
  },
  {
    protocolo: '67890',
    cliente: 'Cliente B',
    titulo: 'Título B',
    solicitante: 'Solicitante B',
    abertura: '02/01/2023 14:00:00',
  },
];

describe('PendenciasTab Component', () => {
  test('renders PendenciasTab with mock data', () => {
    render(<PendenciasTab pendencias={mockPendencias} />);
    
    // Check if the component renders the correct data
    expect(screen.getByText(/Chamados em Pendência/i)).toBeInTheDocument();
    expect(screen.getByText(/Total de Pendências/i)).toBeInTheDocument();
    expect(screen.getByText('Cliente A')).toBeInTheDocument();
    expect(screen.getByText('Título A')).toBeInTheDocument();
    expect(screen.getByText('Solicitante A')).toBeInTheDocument();
  });
});
