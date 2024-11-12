import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummaryPreviewProps {
  monthlyLeads: number;
  responseRate: number;
  meetingRate: number;
  currentCost: number;
  leadValue: number;
  meetingsToClose: number;
  allFieldsFilled: boolean;
}

export const SummaryPreview = ({
  monthlyLeads,
  responseRate,
  meetingRate,
  leadValue,
  meetingsToClose,
  allFieldsFilled,
}: SummaryPreviewProps) => {
  const shouldShowPercentages = responseRate > 1 || meetingRate > 1;

  if (!shouldShowPercentages && !allFieldsFilled) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl text-foreground/40">📊</div>
        <p className="text-lg text-foreground/60">
          Os resultados da sua análise aparecerão aqui após preencher e enviar o formulário
        </p>
      </div>
    );
  }

  const respondingLeads = Math.round((monthlyLeads * responseRate) / 100);
  const scheduledMeetings = Math.round((respondingLeads * meetingRate) / 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card className="p-6 bg-white/10 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 text-foreground/90">Resumo dos Dados</h3>
        <div className="space-y-4 text-lg">
          {shouldShowPercentages && (
            <p>
              {monthlyLeads > 0 ? (
                <>
                  Você atualmente recebe <span className="font-bold text-[#ff6b00]">{monthlyLeads}</span> leads mensais.
                </>
              ) : null}
              {' '}Com uma taxa de resposta média de <span className="font-bold text-[#ff6b00]">{responseRate}%</span>
              {monthlyLeads > 0 ? (
                <>, aproximadamente <span className="font-bold text-[#ff6b00]">{respondingLeads}</span> leads respondem</>
              ) : null}.
            </p>
          )}
          {allFieldsFilled && (
            <p>
              Destes, cerca de <span className="font-bold text-[#ff6b00]">{scheduledMeetings}</span> leads 
              acabam agendando uma reunião. O valor médio de um lead fechado 
              é <span className="font-bold text-[#ff6b00]">{formatCurrency(leadValue)}</span> e, 
              em média, são necessárias <span className="font-bold text-[#ff6b00]">{meetingsToClose}</span> reuniões 
              para converter um lead em cliente.
            </p>
          )}
        </div>
      </Card>
      
      <div className="text-center text-foreground/80 italic">
        Para ver a análise completa e detalhada do seu potencial de economia, 
        clique em "Executar Análise"
      </div>
    </div>
  );
};