'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { BlogPost } from '../../types/seo-events';
import { FileText, Eye, Clock } from 'lucide-react';

interface SEODrawerProps {
  post: BlogPost | null;
  onClose: () => void;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#00E5A0' : score >= 60 ? '#FBBF24' : '#FB7185';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-elevated">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}</span>
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
          <StatusBadge variant={statusVariant} label={post.status} dot />
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
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-text-muted" />
                <div>
                  <p className="text-sm font-semibold text-text-bright">{post.views.toLocaleString()}</p>
                  <span className="text-[11px] text-text-muted">Views</span>
                </div>
              </div>
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
