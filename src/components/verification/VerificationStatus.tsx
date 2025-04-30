
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { VerificationStatus as Status } from '@/types/verification';
import { format } from 'date-fns';

interface VerificationStatusCardProps {
  status: Status;
  category: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export function VerificationStatusCard({
  status,
  category,
  submittedAt,
  reviewedAt,
  rejectionReason
}: VerificationStatusCardProps) {
  const statusConfig = {
    'not_submitted': {
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-800',
      label: 'Not Submitted'
    },
    'pending': {
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Pending Review'
    },
    'approved': {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      label: 'Verified'
    },
    'rejected': {
      icon: XCircle,
      color: 'bg-red-100 text-red-800',
      label: 'Rejected'
    }
  };

  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{category} Verification</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Submitted on {format(new Date(submittedAt), 'PPP')}
            </p>
          </div>
          <Badge className={`mt-2 md:mt-0 ${color}`}>
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Badge>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          {status === 'pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your verification request is currently under review. This process typically takes 2-3 business days.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {status === 'approved' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your account has been successfully verified on {reviewedAt && format(new Date(reviewedAt), 'PPP')}.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {status === 'rejected' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Your verification request was rejected on {reviewedAt && format(new Date(reviewedAt), 'PPP')}.
                  </p>
                  {rejectionReason && (
                    <p className="text-sm font-medium text-red-700 mt-2">
                      Reason: {rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
