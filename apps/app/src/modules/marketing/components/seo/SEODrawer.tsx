'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { BlogPost, SEOScoreItem } from '../../types/seo-events';
import { FileText, Eye, Clock, CheckCircle, AlertTriangle, XCircle, Globe } from 'lucide-react';

interface SEODrawerProps {
  post: BlogPost | null;
  onClose: () => void;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#00E5A0' : score >= 60 ? '#5BB8E6' : '#FB7185';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-elevated">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}</span>
    </div>
  );
}

function CharCount({ label, length, min, max }: { label: string; length: number; min: number; max: number }) {
  const inRange = length >= min && length <= max;
  const close = !inRange && (Math.abs(length - min) <= 5 || Math.abs(length - max) <= 5);
  const color = inRange ? '#00E5A0' : close ? '#5BB8E6' : '#FB7185';
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[11px] font-medium" style={{ color }}>
        {length} / {min}-{max}
      </span>
    </div>
  );
}

function ChecklistItem({ item }: { item: SEOScoreItem }) {
  const iconMap = {
    pass: <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: '#00E5A0' }} />,
    warn: <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: '#5BB8E6' }} />,
    fail: <XCircle className="h-3.5 w-3.5 shrink-0" style={{ color: '#FB7185' }} />,
  };

  return (
    <div className="flex items-center gap-2">
      {iconMap[item.status]}
      <span className="text-xs text-default">{item.label}</span>
    </div>
  );
}

export function SEODrawer({ post, onClose }: SEODrawerProps) {
  if (!post) return null;

  const statusVariant = {
    idea: 'muted' as const,
    draft: 'info' as const,
    review: 'warning' as const,
    published: 'success' as const,
  }[post.status];

  return (
    <DrawerPanel open={!!post} onClose={onClose} title={post.title} width="lg">
      <div className="space-y-5">
        {/* Status & Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {(post.status === 'draft' || post.status === 'review')
            ? <StatusBadge status={post.status as 'draft' | 'review'} />
            : <StatusBadge variant={statusVariant} label={post.status} dot />
          }
          <span className="text-xs text-text-muted">by {post.author}</span>
          {post.publishedDate && (
            <span className="text-xs text-text-muted">· {post.publishedDate}</span>
          )}
        </div>

        {/* SEO Analysis */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">SEO Analysis</h4>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-text-muted">Overall Score</span>
              <ScoreBar score={post.seoScore} />
            </div>

            {/* Char count indicators */}
            <CharCount label="Title Length" length={post.metaTitle.length} min={50} max={60} />
            <CharCount label="Meta Description Length" length={post.metaDescription.length} min={150} max={160} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-text-muted">Target Keyword</span>
                <p className="text-sm text-text-bright">{post.targetKeyword}</p>
              </div>
              <div>
                <span className="text-[11px] text-text-muted">Word Count</span>
                <p className="text-sm text-text-bright">{post.wordCount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[11px] text-text-muted">Read Time</span>
                <p className="text-sm text-text-bright">{post.readTime} min</p>
              </div>
              <div>
                <span className="text-[11px] text-text-muted">Slug</span>
                <p className="text-sm text-text-bright truncate">/{post.slug}</p>
              </div>
            </div>
          </div>

          {/* SEO Score Breakdown */}
          {post.seoChecklist && post.seoChecklist.length > 0 && (
            <div className="space-y-2 border-t border-default pt-3">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Score Breakdown</span>
              <div className="space-y-1.5">
                {post.seoChecklist.map((item, i) => (
                  <ChecklistItem key={i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category & Tags */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Category & Tags</h4>
          <div>
            <span className="text-[11px] text-text-muted">Category</span>
            <p className="text-sm text-text-bright">{post.category}</p>
          </div>
          {post.tags.length > 0 && (
            <div>
              <span className="text-[11px] text-text-muted">Tags</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-base px-2 py-0.5 text-[11px] text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meta Tags */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Meta Tags</h4>
          <div>
            <span className="text-[11px] text-text-muted">Title Tag</span>
            <p className="text-sm text-text-bright">{post.metaTitle}</p>
          </div>
          {post.metaDescription && (
            <div>
              <span className="text-[11px] text-text-muted">Meta Description</span>
              <p className="text-sm text-default">{post.metaDescription}</p>
            </div>
          )}
        </div>

        {/* Performance (published only) */}
        {post.status === 'published' && post.views != null && (
          <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Performance</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">{post.views.toLocaleString()}</p>
                  <span className="text-[11px] text-text-muted">Views</span>
                </div>
              </div>
              {post.organicTraffic != null && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-text-muted" />
                  <div>
                    <p className="text-sm font-semibold text-text-bright">{post.organicTraffic.toLocaleString()}</p>
                    <span className="text-[11px] text-text-muted">Organic</span>
                  </div>
                </div>
              )}
              {post.avgTimeOnPage != null && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-text-muted" />
                  <div>
                    <p className="text-sm font-semibold text-text-bright">{Math.floor(post.avgTimeOnPage / 60)}m {post.avgTimeOnPage % 60}s</p>
                    <span className="text-[11px] text-text-muted">Avg Time</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">{post.readTime} min</p>
                  <span className="text-[11px] text-text-muted">Read Time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        {post.content && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Content Preview</h4>
            <p className="text-sm leading-relaxed text-default">{post.content}</p>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
